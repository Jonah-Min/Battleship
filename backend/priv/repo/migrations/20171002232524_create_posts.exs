defmodule Microblog.Repo.Migrations.CreatePosts do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :postid, :integer
      add :title, :string
      add :content, :string
      add :user_id, :string

      timestamps()
    end

  end
end
