import { PartialType, PickType } from "@nestjs/swagger";
import { CreateCategoryDto } from "./create-category.dto";

export class UpdateCategoryDto extends PickType(PartialType(CreateCategoryDto), ['name']){}