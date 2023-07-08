// import Balancer from 'react-wrap-balancer'
import ReactMarkdown from 'react-markdown';
import rehypeRaw from "rehype-raw";


// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
// const BalancerWrapper = (props: any) => <Balancer {...props} />

type ChatGPTAgent = 'user' | 'system' | 'assistant'

export interface ChatGPTMessage {
    role: ChatGPTAgent
    content: string
}

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
    <div className="flex min-w-full animate-pulse px-4 py-5 sm:px-6">
        <div className="flex flex-grow space-x-3">
            <div className="min-w-0 flex-1">
                <p className="font-large text-xxl text-gray-900">
                    <a href="modules/chat/component/ChatLine" className="hover:underline">
                        AI
                    </a>
                </p>
                <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 h-2 rounded bg-zinc-500"></div>
                        <div className="col-span-1 h-2 rounded bg-zinc-500"></div>
                    </div>
                    <div className="h-2 rounded bg-zinc-500"></div>
                </div>
            </div>
        </div>
    </div>
)

export function ChatLine({role = 'assistant', content}: ChatGPTMessage) {
    if (!content) {
        return null
    }
    return (
        <div className='float-left clear-both w-full'>
            <div className={
                role == 'assistant' ? 'bg-slate-900 ' : 'bg-slate-700'
            }
            >
                <div className="flex space-x-3 ">
                    <div className="flex-1 gap-4 w-full">
                        <p className="font-large text-xxl">
                            <a href="modules/chat/component/ChatLine"
                               className="hover:underline">
                                {role == 'assistant' ? 'AI' : 'You'}
                            </a>
                        </p>
                        <div className='prose prose-invert prose-headings:underline prose-a:text-blue-600 max-w-6xl'>
                            <ReactMarkdown rehypePlugins={[rehypeRaw]} linkTarget="_blank">
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
