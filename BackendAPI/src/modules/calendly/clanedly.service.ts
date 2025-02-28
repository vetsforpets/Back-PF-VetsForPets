import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../users/entity/users.entity'; 
import { Repository } from 'typeorm';

@Injectable()
export class CalendlyApiService {
  private readonly calendlyApiUrl = 'https://api.calendly.com/scheduled_events';
  private readonly calendlyApiToken: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
  ) {
    this.calendlyApiToken = this.configService.get<string>('CALENDLY_API_TOKEN');
  }

  async listEvents(params?: any): Promise<any> {
    try {
      const response: AxiosResponse = await axios.get(this.calendlyApiUrl, {
        headers: {
          Authorization: `Bearer ${this.calendlyApiToken}`,
          'Content-Type': 'application/json',
        },
        params,
      });

      let events = response.data.collection;

      for (const event of events) {
        const inviteeEmail = event.invitees?.[0]?.email;
        if (inviteeEmail) {
          try {
            const user = await this.usersRepository.findOne({ where: { email: inviteeEmail } });
            if (user) {
              event.userId = user.id;
            } else {
              event.userId = null;
            }
          } catch (dbError) {
            console.error('Database error during user lookup:', dbError);
            event.userId = null;
          }
        } else {
          event.userId = null;
        }
      }

      if (params?.questions && Array.isArray(params.questions) && params.questions.length > 0) {
        events = events.filter(event => {
          if (!event.questions_and_answers) { 
            return false;
          }
          const eventQuestions = event.questions_and_answers.map(qa => qa.question); 
          return params.questions.every(question => eventQuestions.includes(question));
        });
      }

      return events;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      } else if (error.request) {
        throw new HttpException('No response from Calendly API', HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException('Failed to fetch Calendly events', HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}