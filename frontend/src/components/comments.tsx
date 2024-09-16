import { api } from '@/app/config/api';
import { useAuth } from '@/app/context/AuthContext';
import { useGet } from '@/hooks/useApi';
import { commentType } from '@/types/comment-type';
import { MessageCircle, Trash2 } from 'lucide-react';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Pagination } from './pagination';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

type responseType = {
  comments: commentType[];
  total: number;
};

export default function CommentSection({ id }: { id: number }) {
  const [comments, setComments] = useState<Array<commentType>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 5;
  const { userId } = useAuth();

  const { response, get } = useGet({
    url: `/api/projetos/${id}/comentarios?page=${currentPage}&limit=${commentsPerPage}`,
  });

  useEffect(() => {
    if (response) {
      const { comments, total } = response as responseType;
      setComments(comments);
      setTotalComments(total);
    }
  }, [response]);

  const totalPages = Math.ceil(totalComments / commentsPerPage);

  const handleAddComment = () => {
    api
      .post(`/api/projetos/${id}/comentarios`, { texto: newComment })
      .then(() => {
        setNewComment('');
        setCurrentPage(1);
        get({});
      });
  };

  const handleDelete = (commentId: number) => {
    api.delete(`/api/projetos/comentarios/${commentId}`).then(() => {
      get({});
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-blue-600" />
        Comentários
      </h2>
      <div className="border shadow-lg rounded-lg py-10 px-10 mt-2">
        <div className="space-y-4">
          {comments?.map(comment => (
            <div key={comment.id} className="p-3 border rounded-md bg-white">
              <div className="flex justify-between">
                <span className="font-semibold">{comment.usuario.nome}</span>
                <span className=" flex justify-center items-center">
                  {userId === comment.usuario.id && (
                    <Button
                      variant={'ghost'}
                      className="p-2 rounded-full"
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(comment.id);
                      }}
                    >
                      <Trash2 className=" text-red-400 h-5 w-5" />
                    </Button>
                  )}
                </span>
              </div>
              <p className="mt-1">{comment.texto}</p>
              <div className="text-gray-500 font-medium text-sm flex w-full justify-end pr-2">
                {moment(comment.data).format('hh:mm DD/MM/YY')}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center py-4">
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
        <div className="mb-5 flex flex-col items-end">
          <Textarea
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder="Adicione um comentário..."
            className="w-full p-2 border rounded-md"
            rows={3}
          />
          <Button
            onClick={handleAddComment}
            className="gap-2 text-base px-4 py-6 rounded-full bg-white mt-4 w-fit"
          >
            Comentar
            <MessageCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </>
  );
}
