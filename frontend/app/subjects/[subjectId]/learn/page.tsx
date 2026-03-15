"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/apiClient";
import { Spinner } from "@/components/common/Spinner";

export default function LearnRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectId = params.subjectId as string;

  useEffect(() => {
    if (!subjectId) return;
    apiFetch(`/api/subjects/${subjectId}/first-video`)
      .then((res) => res.json())
      .then((data) => {
        if (data.video_id) {
          router.replace(`/subjects/${subjectId}/video/${data.video_id}`);
        }
      })
      .catch(() => {});
  }, [subjectId, router]);

  return (
    <div className="flex items-center justify-center p-12">
      <Spinner />
    </div>
  );
}
