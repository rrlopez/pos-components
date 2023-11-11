import { FaTools } from "react-icons/fa"
import { PiPlugsFill } from "react-icons/pi"
import { useQuery } from "react-query"
import coreAPI from "../api/coreAPI"
import { LoadingPrompt } from "../components/dialog/Prompt"
import { showModal } from "./Overlay"
import { manifest } from "./constants"

export const checkServices = ()=>useQuery({
    queryKey: 'checkServices',
    queryFn: async () => {
      if(process.env.APP_MAINTENANCE){
        showModal(LoadingPrompt, {
          size: 'max-w-lg',
          icon: PiPlugsFill,
          label: `${manifest.websiteName} is performing a scheduled maintenance`,
          description: process.env.APP_MAINTENANCE_MSG
        })
        return
      }

      Promise.all([coreAPI.checkAuth(), coreAPI.checkGQL()]).catch(error => {
        console.error('One of the promises failed:', error)
        showModal(LoadingPrompt, {
          size: 'max-w-md',
          icon: FaTools,
          label: 'Unavailable for Now',
          description:
            "Our backend services are unavailable at the moment. We're sorry for any inconvenience this may cause. Our team is actively troubleshooting the issue to get things back on track.",
        })
      })
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })