import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'location' })
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuid();

  @Column()
  street: string

  @Column()
  city: string

  @Column()
  state: string

  @Column()
  zipCode: number

  @Column()
  latitude: string

  @Column()
  longitude: string

}
