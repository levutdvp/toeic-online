import { API_URL } from "@/consts/common.const";
import { apiCall } from "@/services/api-call";
import { map } from "rxjs/operators";

export interface IExamSection {
  id: number;
  exam_code: string;
  exam_name: string;
  section_name: string;
  part_number: string;
  question_count: number;
  duration: number;
  max_score: number;
}

export interface IQuestion {
  id: number;
  exam_section_id: number;
  question_number: number;
  part_number: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string;
  explanation: string | null;
  audio_url: string | null;
  image_url: string | null;
}

export interface IGetListQuestionTest {
  exam_section: IExamSection;
  questions: IQuestion[];
}

export const getListQuestionTest = (exam_code: string, part_number: number) => {
  return apiCall<{
    exam_section: IExamSection;
    questions: IQuestion[][];
  }>(
    {
      url: `${API_URL}/api/exam-sections/${exam_code}/${part_number}/questions`,
      method: "GET",
    },
    {
      customError: "throwAndNotify",
    }
  ).pipe(
    map((res) => ({
      exam_section: res.data.exam_section,
      questions: res.data.questions.flat(),
    }))
  );
};
