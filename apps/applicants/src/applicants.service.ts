/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { CreateApplicantInput } from './dto/create-applicant.input';
import { UpdateApplicantInput } from './dto/update-applicant.input';

@Injectable()
export class ApplicantsService {
  private readonly applicants;

  constructor() {
    this.applicants = [];
  }

  create(createApplicantInput: CreateApplicantInput) {
    this.applicants.push(createApplicantInput);
    return createApplicantInput;
  }

  findAll() {
    return this.applicants;
  }

  findOne(id: string) {
    return this.applicants.find((applicant) => applicant.id === id);
  }

  update(id: string, updateApplicantInput: UpdateApplicantInput) {
    const applicant = this.applicants.find((applicant) => applicant.id === id);
    if (applicant) {
      Object.assign(applicant, updateApplicantInput);
      return applicant;
    }
    return null;
  }

  remove(id: string) {
    const index = this.applicants.findIndex((applicant) => applicant.id === id);
    if (index >= 0) {
      this.applicants.splice(index, 1);
    }
  }
}
