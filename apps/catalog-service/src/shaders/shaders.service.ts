import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Shader, ShaderDocument } from './schemas/shader.schema';
import { CreateShaderDto } from './dto/create-shader.dto';

@Injectable()
export class ShadersService {
  constructor(@InjectModel(Shader.name) private shaderModel: Model<ShaderDocument>) { }

  async create(createShaderDto: CreateShaderDto): Promise<Shader> {
    const createdShader = new this.shaderModel(createShaderDto);
    return createdShader.save();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<Shader[]> {
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    return this.shaderModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec();
  }

  async findOne(id: string): Promise<Shader> {
    const shader = await this.shaderModel.findById(id).exec();
    if (!shader) {
      throw new NotFoundException(`Shader with ID ${id} not found`);
    }
    return shader;
  }

  async update(id: string, updateData: Partial<Shader>): Promise<Shader> {
    const updatedShader = await this.shaderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updatedShader) {
      throw new NotFoundException(`Shader with ID ${id} not found`);
    }
    return updatedShader;
  }

  async remove(id: string): Promise<Shader> {
    const deletedShader = await this.shaderModel.findByIdAndDelete(id).exec();

    if (!deletedShader) {
      throw new NotFoundException(`Shader with ID ${id} not found`);
    }
    return deletedShader;
  }
}