defmodule Microblog.Repo.Migrations.CreateFollowings do
  use Ecto.Migration

  def change do
    create table(:followings) do
      add :follower_user_id, :string
      add :following_user_id, :string

      timestamps()
    end

  end
end
