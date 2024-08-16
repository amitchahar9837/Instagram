import React from 'react'
import { LuSendHorizonal } from 'react-icons/lu'

export default function CreateCommentSection({handleSubmit, commentText, setCommentText}) {
  return (
      <form
      onSubmit={handleSubmit}
      className="w-full -mt-2 pb-2 flex justify-between items-center border-b-2 border-slate-300 "
    >
      <textarea
        rows={1}
        placeholder="Add a comment"
        className="w-full resize-none noScrollbar border-none outline-none focus:ring-0 focus:border-none bg-red-200 placeholder:text-gray-400 text-md"
        onChange={(e) => setCommentText(e.target.value)}
        value={commentText}
      />
      {commentText.length > 0 && (
        <button type="submit" className="pr-4">
          <LuSendHorizonal className="text-xl text-blue-500" />
        </button>
      )}
    </form>
  )
}
