// import { useMutation } from "@tanstack/react-query";
// import { saveUserToDB, updateUserProfile } from "./api";;
// import { User } from "./types";
// export const createUserMutaion = () => useMutation({
//     mutationKey: ['createUser'],
//     mutationFn: ({data, uid} : {data: User; uid: string}) =>  saveUserToDB(data, uid),
// })
// export const updateUserProfileMutation = () => useMutation({
//     mutationKey: ['updateUserProfile'],
//     mutationFn: ({uid, name, email} : {uid: string; name: string; email: string;}) =>  updateUserProfile({uid, name, email}),
// })