export interface ICourse {
  userId: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimation: number;
  public: boolean;
  thumbnail: {
    id: string;
    url: string;
  };
  lessons: [
    {
      title: string;
      description: string;
    }
  ];
  units: [{ title: string }];
  quiz: [{ question: string }];
  contents: [
    {
      title: string;
      link: { id: string; url: string };
    }
  ];
  prerequisties: [{ courseId: string }];
  enableUnitProgressRequirement: boolean;
  awardCompletionCertificate: boolean;
  published: boolean;
}

export interface ICreateRequest {
  title: { value?: string };
  description: { value?: string };
  category: { value?: string };
  difficulty: { value?: string };
  estimation: { value?: number };
  public: { value?: boolean };
}
