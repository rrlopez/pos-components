import _ from 'lodash'
import { useQuery } from 'react-query'
import { graphqlQuery } from '../../../api'
import useAuth from '../../../auth/auth.store'
import { manifest } from '../../../utils/constants'
import FilterSelectInput from '../../dataView/_components/toolbar/FilterSelectInput'

export const useMarketplaceOptions = (queryKey:any, ids:any)=>useQuery({
  queryKey,
  queryFn: async () => {
    const { user }: any = useAuth.getState()
    ids = ids || user.marketplaces.map(({ value }: any) => value)
    const { findManyMarketplaces }: any = await graphqlQuery(`
      findManyMarketplaces(${ids.length>0?`where: {id: {in: [${ids}]}}`:''} orderBy: {name: asc}) {
        id
        name
        logo
      }
    `)

    return _.sortBy(
      findManyMarketplaces.filter(({id}:any)=>id!==7).map(({ name, id, ...marketplace }: any) => ({ label: name, value: id, ...marketplace })),
      item => (item.label === manifest.websiteName ? 0 : 1),
    )
  },
  refetchOnWindowFocus: false,
})

function MarketplaceSelectInput({queryKey, name='marketplaces.id', ids, ...props}:any) {
  const { data: marketplaces = [] } = useMarketplaceOptions(queryKey, ids)
  
  return <FilterSelectInput name={name} label='Marketplace' options={marketplaces} type={'number'} {...props}/>
}

export default MarketplaceSelectInput