import {api} from "~/utils/api/server";

export default async function Home() {

  const x = await api.items.addItem.mutate({
    status: 'active',
    pictureOverride: 'https://example.com/image.jpg',
    id: '123',
  });
  return (
    <div>

    </div>
  );
}
