import { useMutation } from "@tanstack/react-query";
import { saveUserToDB } from "./api";;
import { User } from "./types";
export const createUserMutaion = ({data, uid} : {data: User; uid: string}) => useMutation({
    mutationKey: ['createUser'],
    mutationFn: ({data, uid} : {data: User; uid: string}) =>  saveUserToDB(data, uid),
})