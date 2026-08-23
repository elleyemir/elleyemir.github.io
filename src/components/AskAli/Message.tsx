import { KnightMark } from '../Logo';

export interface ChatBubble {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** Renders in an error tone without implying it came from the model. */
  isError?: boolean;
}

export default function Message({ message }: { message: ChatBubble }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-gold-500/[0.25] bg-gold-500/[0.08] text-gold-400">
          <KnightMark className="h-4 w-4" />
        </span>
      )}
      <div
        className={`max-w-[82%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-2.5 text-[0.84rem] leading-relaxed ${
          isUser
            ? 'rounded-br-md bg-gold-500/[0.14] text-parchment'
            : message.isError
              ? 'rounded-bl-md border border-red-400/[0.25] bg-red-400/[0.08] text-red-200'
              : 'rounded-bl-md border border-parchment/[0.1] bg-parchment/[0.045] text-parchment/[0.85]'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex gap-2.5">
      <span className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg border border-gold-500/[0.25] bg-gold-500/[0.08] text-gold-400">
        <KnightMark className="h-4 w-4" />
      </span>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-parchment/[0.1] bg-parchment/[0.045] px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold-400/[0.8]"
            style={{ animationDelay: `${i * 160}ms`, animationDuration: '1s' }}
          />
        ))}
        <span className="sr-only">Assistant is typing</span>
      </div>
    </div>
  );
}
