import { manifest } from "../../utils/constants"

function Footer() {
    return (
        <div className='flex justify-center gap-2 px-1 md:px-4 py-0.5 text-[0.75rem] rounded-t-md'>
        <div className='hidden grow sm:block'>
            Powered by{' '}
            <a href={`${manifest.websiteURL}/`} className='hover:underline hover:text-blue-600 ' target='_blank' rel='noreferrer'>
            {manifest.websiteName}
            </a>{' '}
            &#169; {new Date().getFullYear()}
        </div>
        <a href={`${manifest.websiteURL}/knowledge-base-faqs/`} className='hover:underline hover:text-blue-600' target='_blank' rel='noreferrer'>
            FAQ&apos;s
        </a>
        </div>
    )
}
  
export default Footer