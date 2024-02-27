import { Button } from '@mui/material'
import { useGoogleLogin } from '@react-oauth/google'
import React from 'react'

export default function GoogleLogin() {
   const url = ""
   const logOnWithGoogleHandler = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
         console.log(tokenResponse.access_token)
         const result = await fetch(
            `link`
         )
         console.log(await result.json(), 'user information')
      }
   })

   return (
      <div>
         <Button onClick={() => logOnWithGoogleHandler}>Login with google</Button>
      </div>
   )
}
