import {
    BadRequestException,
    Body,
    Controller, Delete,
    Get,
    HttpCode,
    NotFoundException,
    Param,
    Post,
    Put,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pet } from "./pet.entity";
import { MongoRepository } from "typeorm";
import { ObjectID } from 'mongodb';

@Controller('pets')
export class PetsController {
    constructor(@InjectRepository(Pet) private readonly petsRepository: MongoRepository<Pet>) {}

    @Get()
    async getPets(): Promise<Pet[]> {
        return await this.petsRepository.find();
    }

    @Get(':id')
    async getPet(@Param('id') id): Promise<Pet> {
        const pet = ObjectID.isValid(id) && await this.petsRepository.findOne(id);
        if (!pet) {
            // Entity not found
            throw new NotFoundException();
        }
        return pet;
    }

    @Post()
    async createPet(@Body() pet: Partial<Pet>): Promise<Pet> {
        if (!pet || !pet.name || !pet.animalType) {
            throw new BadRequestException(`A pet must have at least name and animalType defined`);
        }
        return await this.petsRepository.save(new Pet(pet));
    }

    @Put(":id")
    @HttpCode(204)
    async updatePet(@Param("id") id, @Body() pet: Partial<Pet>): Promise<void> {
        // Check if entity exists
        const exists = ObjectID.isValid(id) && await this.petsRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.petsRepository.update(id, pet);
    }

    @Delete(':id')
    @HttpCode(204)
    async deletePet(@Param('id') id): Promise<void> {
        // Check if entity exists
        const exists = ObjectID.isValid(id) && await this.petsRepository.findOne(id);
        if (!exists) {
            throw new NotFoundException();
        }
        await this.petsRepository.delete(id);
    }
}
