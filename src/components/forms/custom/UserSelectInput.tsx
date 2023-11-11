import { useQuery } from 'react-query'
import { graphqlQuery } from '../../../api'
import useAuth from '../../../auth/auth.store'
import FilterSelectInput from '../../dataView/_components/toolbar/FilterSelectInput'

function UserSelectInput({name, type, ...props}:any) {
    const { data: users = [] } = useQuery({
        queryKey: 'usersOptions',
        queryFn: async () => {
          const { user }:any = useAuth.getState()
          const { findManyEmployees }: any = await graphqlQuery(`
            findManyEmployees (where: { user_id: { equals: ${user.id}}}){
              id
              name
            }
          `)
    
          return [{label: 'Admin', value: 'Admin'}, ...findManyEmployees.map(({ name }: any) => ({ label: name, value: name }))]
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
      })
      return <FilterSelectInput name={name} type={type} label='User' options={users} {...props}/>
}

export default UserSelectInput