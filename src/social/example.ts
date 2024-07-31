import {AppSocial} from "./AppSocial";

const socialExample = async () => {
  try{
    const appSocial = new AppSocial("http://localhost:3000/oauth","http://localhost:3000");

    // handle login
    await appSocial.auth.loginGoogle()

    // in redirect page => get information of user
    // if you get "code" in query router, pass to param function
    const code = "asdksjafhdfkjsdhjkfhsdfhdsf" // demo code
    const response = await appSocial.user?.getInformation(code)
    const user = response!.user
    /*
    user {
      id
      email
      encryptionKey
      createdAt
      updatedAt
    }
     */

    // or if you only want to get tokens
    const tokens = await appSocial.user?.getTokens() // return access token & id token

    // if your account didn't get private key => field generationKey will be "null"
    if(!user.encryptionKey){
      // handle generate private key
      const privateKey = await appSocial.user?.generatePrivateKey()
      console.log(privateKey)
    }

    // if you already get private key => get it
    const privateKey = await appSocial.user?.getPrivateKey()
    console.log(privateKey)

    // logout function
    await appSocial.auth.logout()
  }catch (e){
    console.log(e)
  }
}
