'use client';

import InfiniteScroll from '@/components/common/lnfiniteScroll';
import {QueryFunctionContext} from '@tanstack/react-query';
import React from 'react';

interface RedditProject {
  id: string;
  title: string;
  author: string;
}

interface RedditResponse {
  data: {
    children: {
      data: RedditProject;
    }[];
    after: string | null;
  };
}

const fetchRedditProjects = async ({pageParam}: QueryFunctionContext) => {
  const res = await fetch(`https://www.reddit.com/r/learnprogramming/new.json?limit=10&after=${pageParam ?? ''}`);
  const data: RedditResponse = await res.json();

  return {
    pages: [data], // RedditResponse 배열로 반환
    pageParams: [data.data.after], // 커서는 배열로 반환
  };
};

const RedditProjects: React.FC = () => {
  return (
    <InfiniteScroll
      className="h-[500px] w-[600px]"
      queryKey="test"
      fetchData={fetchRedditProjects}
      render={group => (
        <div>
          {/* 각 페이지에서 children을 순회하며 데이터 출력 */}
          {group.pages.flatMap(page =>
            page.data.children.map(({data: project}) => (
              <div key={project.id} className="mb-3 h-[200px] w-[540px] bg-slate-600">
                <div>{project.author}</div>
                <div>{project.title}</div>
              </div>
            )),
          )}
        </div>
      )}
    />
  );
};

export default RedditProjects;
