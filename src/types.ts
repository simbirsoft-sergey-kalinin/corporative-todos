export type todoType = {
    id?: number;
    author: number;
    text: string;
    isComplete: boolean;
};

export type reviewType = {
    id?: number,
    userId: number,
    review: string,
}

export type userType = {
    id?: number,
    email: string,
    password: string,
}

export type countType = {
    id?: number,
    userId: number,
    todosCount: number,
}

export type personalInfoType = {
    id?: number,
    userId: number,
    info: string
}
