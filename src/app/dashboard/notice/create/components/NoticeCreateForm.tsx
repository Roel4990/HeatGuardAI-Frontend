'use client';

import { Stack } from '@mui/material';
import { NoticeTitleField } from "@/app/dashboard/notice/create/components/NoticeTitleField";
import { NoticeCategorySelect } from "@/app/dashboard/notice/create/components/NoticeCategorySelect";
import { NoticeFogSelect } from "@/app/dashboard/notice/create/components/NoticeFogSelect";
import { NoticeContentField } from "@/app/dashboard/notice/create/components/NoticeContentField";
import { NoticeFileUpload } from "@/app/dashboard/notice/create/components/NoticeFileUpload";
import { NoticePinCheckbox } from "@/app/dashboard/notice/create/components/NoticePinCheckbox";
import { NoticeFormActions } from "@/app/dashboard/notice/create/components/NoticeFormActions";
import Typography from "@mui/material/Typography";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useNoticeCreateMutation } from "@/hooks/mutations/noticeCreate/use-notice-create-mutation";
import { paths } from "@/paths";

export function NoticeCreateForm() {
  const router = useRouter();
  const { mutateAsync, isPending } = useNoticeCreateMutation();

  const [title, setTitle] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [cfCd, setCfCd] = React.useState<{ cf_cd: string; label: string } | null>(null);
  const [content, setContent] = React.useState('');
  const [pin, setPin] = React.useState(false);
	const [noticeFileCd, setNoticeFileCd] = React.useState<number | null>(null);


  const handleSubmit = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!category.trim()) {
      alert("공지 유형을 선택해주세요.");
      return;
    }
    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    const result = await mutateAsync({
      notice_title: title,
      notice_type: category,
			cf_cd: cfCd?.cf_cd ?? '',
      notice_content: content,
      notice_fix_yn: pin,
      notice_file_cd: noticeFileCd,
    });

    if (result.success) {
      router.push(paths.dashboard.notice);
    } else {
      alert(result.error ?? "공지 작성 실패");
    }
  };
	return (
		<Stack
			spacing={4}
			sx={{
				backgroundColor: '#f7f8fa',
				p: '30px',
				borderRadius: 1, // 16px
				mt: 3,
				border: 'none',
				boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
				transition: 'box-shadow 150ms ease, transform 150ms ease',
				'&:hover': {
					boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
				},
			}}
		>
			<Typography variant="h5" fontWeight={700}>
				공지사항 작성
			</Typography>
      <NoticeTitleField value={title} onChange={setTitle} />
      <NoticeCategorySelect value={category} onChange={setCategory} />
      <NoticeFogSelect value={cfCd} onChange={setCfCd} />
      <NoticeContentField value={content} onChange={setContent} />
			<NoticeFileUpload onUploaded={setNoticeFileCd} />
      <NoticePinCheckbox checked={pin} onChange={setPin} />
      <NoticeFormActions onCancel={() => router.back()} onSubmit={handleSubmit} submitting={isPending} />
		</Stack>
	);
}
