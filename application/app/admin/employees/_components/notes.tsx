"use client";
import { createNote } from "@/actions/notes.action";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistance } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Notes({ data }: { data: any }) {
  const router = useRouter();

  const handlePublishNote = async () => {
    const notes = document.querySelector(
      "textarea[name='notes']",
    ) as HTMLTextAreaElement;

    try {
      const response = await createNote({
        content: notes.value,
        userId: data.id,
      });
      if (response && response.status === 201) {
        toast.success("Note created successfully");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(data);

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-end space-y-2 rounded-lg border p-4">
        <Textarea
          name="notes"
          className="resize-none border-none p-0 focus-visible:border-[1.5px] focus-visible:border-gray-500 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button
          size="sm"
          className="w-fit font-normal"
          onClick={handlePublishNote}
        >
          Post
        </Button>
      </div>

      <div className="space-y-2">
        <div className="mb-4 text-sm font-medium tracking-tight">
          Activities
        </div>

        {data.notes.length === 0 && (
          <div className="my-4 text-center text-sm text-muted-foreground">
            No notes
          </div>
        )}

        {data.notes.length > 0 &&
          data.notes.map((note: any) => {
            return (
              <div className="space-y-2 border-b" key={note.id}>
                <div className="text-sm tracking-tight text-muted-foreground">
                  {note.content}
                </div>
                <div className="pb-2 text-xs text-muted-foreground">
                  {formatDistance(note.createdAt, new Date(), {
                    addSuffix: true,
                  })}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
