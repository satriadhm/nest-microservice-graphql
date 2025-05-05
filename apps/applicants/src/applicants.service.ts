import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicantInput } from './dto/create-applicant.input';
import { UpdateApplicantInput } from './dto/update-applicant.input';
import { Applicant } from './entities/applicant.entity';

@Injectable()
export class ApplicantsService {
  constructor(
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {}

  async create(createApplicantInput: CreateApplicantInput): Promise<Applicant> {
    const applicant = this.applicantRepository.create({
      ...createApplicantInput,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.applicantRepository.save(applicant);
  }

  async findAll(): Promise<Applicant[]> {
    return this.applicantRepository.find();
  }

  async findOne(id: string): Promise<Applicant> {
    return this.applicantRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateApplicantInput: UpdateApplicantInput,
  ): Promise<Applicant> {
    await this.applicantRepository.update(id, {
      ...updateApplicantInput,
      updatedAt: new Date(),
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.applicantRepository.delete(id);
    return result.affected > 0;
  }
}
