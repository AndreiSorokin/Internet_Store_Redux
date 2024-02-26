import { User } from '../../misc/type'
import userReducer, { clearUser, getUserInput } from '../../redux/slices/userSlice'

const initialState = {
   user: {
      email: 'a@aa.aa',
      password: '12345',
      name: 'name1',
      avatar: "avatar",
   }
}

describe("user reducer", () => {
   test("should clear user information from localStorage", () => {
      
   })
})