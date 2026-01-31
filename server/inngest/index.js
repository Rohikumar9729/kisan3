import {inngest} from "inngest";
import User from "../models/user";


export const inngest=new Inngest({name:"Kisan App "});

//inngest function to save user data to database
const syncUserCreation=inngest.createFunction(
    {id:'sync-user-from clerk'},
        {event:'clerk/user.created' },
        async ({ event }) => {
            const {id,first_name,last_name,email_addresses,image_url}=event.data

            const userData={
                _id:id,
                email:email_addresses[0].email_address,
                name:`${first_name} ${last_name}`,
                image:image_url
            }

            await User.create(userData);
        }
    
)

//Inngest fucntion to delete user from database
const syncUserDeletion=inngest.createFunction(
    {id:'delete-user-from clerk'},
        {event:'clerk/user.deleted' },
        async ({ event }) => {
            const {id}=event.data
            await User.findByIdAndDelete(id)
        }
    
)

const syncUserUpdation=inngest.createFunction(
    {id:'Update-user-from clerk'},
        {event:'clerk/user.updated' },
        async ({ event }) => {
            const { id,first_name,last_name,email_addresses,image_url}=event.data 
            const userData={
                _id:id,
                email:email_addresses[0].email_address,
                name:`${first_name} ${last_name}`,
                image:image_url
            }
            await User.findByIdAndUpdate(id,userData)
        }
    
)

export const functions = [syncUserCreation,syncUserDeletion,syncUserUpdation];