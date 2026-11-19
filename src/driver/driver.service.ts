import { Injectable,NotFoundException,BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { QueryFailedError, Repository,ILike } from 'typeorm';
import { Driver } from './entities/driver.entites.js';
import { CreateDriverDto } from './dtos/create-driver.dto.js';
import { UpdateDriverDto } from './dtos/update-driver.dto.js';
import { QueryDriverDto } from './dtos/query-driver.dto.js';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver) 
        private readonly driverRepo: Repository<Driver>,){}


    async create (driver : CreateDriverDto): Promise<Driver> {
        
            const date = new Date(driver.dateOfBirth);
             if (isNaN(date.getTime())) {
                throw new BadRequestException('Invalid date of birth');
            }
            if(date.getTime()>Date.now()){
                throw new BadRequestException('Date of Birth can be in future');
            }
            try{
            const newDriver = this.driverRepo.create(driver);
            return await this.driverRepo.save(newDriver);
        }
        catch(error){
            if(error instanceof QueryFailedError){
                const dbError = error.driverError as {code ?: string};
            
            if(dbError.code==='23505' ){
            throw new ConflictException('Driver already exists');
        }
    }
    throw error;
    }

    
 }
    async findAll(query: QueryDriverDto) {
        const { search, page = 1, limit = 10 } = query;

        const where = search? [
            { name: ILike(`%${search}%`) },
            { phone: ILike(`%${search}%`) },]: {};

        const [data, total] = await this.driverRepo.findAndCount({
            where,
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });

            return {data,
            meta: {total,page,limit,
            totalPages: Math.ceil(total / limit),},
        };
    }
    async findOne(id:number):Promise< Driver>{
        const driver = await this.driverRepo.findOne({
          where: {id:id,},
        });
        if (driver){
        return driver;
        }
        else{
           
            throw new NotFoundException('Driver not Found');
        }
    }
    async remove(id:number):Promise <{message :string}>{
        const driver = await this.findOne(id);
        await this.driverRepo.remove(driver);
        return {
            message :'Driver deleted successfullly',
        };

    }
    async update(id:number, driver : UpdateDriverDto){
        const drvr = await this.driverRepo.findOne({where: { id:id }});
       
        if (!drvr) {
            throw new NotFoundException('Driver not found');
        }

        if (driver.dateOfBirth) {
            const date = new Date(driver.dateOfBirth);

            if (isNaN(date.getTime()) || date.getTime() > Date.now()) {
            throw new BadRequestException('Invalid date of birth');
            }
        }

        const res = (await this.driverRepo.update(id,driver)).affected;
        if (res != null && res > 0) {
        return 'Driver updated successfully';}
        else{
            throw new NotFoundException('Driver not found');
        }
    }
}



