import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull} from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    async execute(req: Request,res: Response){
        const { survey_id } = req.params

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)
        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull())
        })

        const detractor = surveysUsers.filter((survey) => survey.value >= 0 && survey.value <= 6).length
        const promotors = surveysUsers.filter((survey) => survey.value >= 9 && survey.value <= 10).length
        const passive = surveysUsers.filter((survey) => survey.value >= 7 && survey.value <= 8).length
        const totalAswers = surveysUsers.length

        const calculate = ((promotors - detractor) / totalAswers) * 100

        return res.json({
            detractor,
            promotors,
            passive,
            totalAswers,
            nps:`${calculate.toFixed(2)} %`
        })
        
    }
}

export { NpsController }