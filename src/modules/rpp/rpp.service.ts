import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/redis/redis.service';
import { ChatService } from '../../common/database/chat.service';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as crypto from 'crypto';
import * as dotenv from "dotenv";
import { CreateRppDto } from './dto/create-rpp.dto';
import { Rpp } from './dto/rpp.model';

dotenv.config();

@Injectable()
export class rppService {
  private genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyC4pcBL2FkYS7MvZMZy6x2hkbuwEnxbZ9o');
  private rppList: Rpp[] = [];

  constructor(
    private readonly redisService: RedisService,
    private readonly chatService: ChatService
  ) {}

  /**
   * Init Template RPP menggunakan model AI Generative.
   * Beserta Bahan Ajar, Materi Pembelajaran, dan Penilaian.
   */
  async generateRpp(input: CreateRppDto): Promise<Rpp> {
    const sessionId = crypto.randomUUID();
    const cacheKey = `rpp:${sessionId}:${input.title}`;

    const cachedData = await this.redisService.getSession(cacheKey);
    if (cachedData.messages.length > 0) {
        console.log(`✅ Cache hit: ${input.title}`);
        return {
            id: this.rppList.length + 1,
            sessionId,
            title: input.title,
            content: cachedData.messages.map(m => `${m.role}: ${m.content}`).join('\n'),
        };
    }

    console.log(`🚀 Cache miss: ${input.title}, generating new rpp...`);

    try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `Buatkan RPP dengan judul: ${input.title}`;
        
        const result = await model.generateContent(prompt);

        // 2️⃣ Pastikan hasil respons tidak kosong
        if (!result.response || !result.response.candidates || result.response.candidates.length === 0) {
            throw new Error("AI API tidak mengembalikan data yang valid.");
        }

        const candidate = result.response.candidates[0];

        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error("AI API mengembalikan format data yang tidak sesuai.");
        }

        const content = candidate.content.parts[0].text || "Tidak ada teks yang dihasilkan.";

        const newRpp: Rpp = {
            id: this.rppList.length + 1,
            sessionId,
            title: input.title,
            content,
        };

        this.rppList.push(newRpp);

        // 3️⃣ Simpan ke Redis (TTL 1 jam)
        await this.redisService.addMessage(sessionId, 'assistant', content);

        // 4️⃣ Simpan ke MongoDB sebagai log sesi
        await this.chatService.saveChat(sessionId, input.title, content, false);

        return newRpp;
    } catch (error) {
        console.error("❌ Error generating RPP:", error.message);
        throw new Error("Gagal generate RPP");
    }
}


  /**
   * Mengambil semua rpp yang pernah dibuat.
   */
  async getAllrpp(): Promise<Rpp[]> {
    return this.rppList;
  }

  /**
   * Mengakhiri sesi rpp dan memindahkan percakapan dari Redis ke MongoDB.
   */
  async endrppSession(sessionId: string): Promise<void> {
    console.log(`🛑 Mengakhiri sesi rpp: ${sessionId}`);
    const sessionData = await this.redisService.endSession(sessionId);
    if (!sessionData) {
      console.warn(`⚠️ Tidak ada data sesi yang ditemukan untuk ${sessionId}`);
      return;
    }
    await this.chatService.endSession(sessionId);

    console.log(`✅ Sesi ${sessionId} telah dipindahkan ke MongoDB`);
  }
}
