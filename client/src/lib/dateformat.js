export const dateformat=(date)=>{
    return new Date(date).toLocaleDateString('en-US',{
        weeday:'short',
        month:'long',
        day:'numeric',
        hour:'numeric',
        minute:'numeric'
    })
}