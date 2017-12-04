# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Microblog.Repo.insert!(%Microblog.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Microblog.Repo
alias Microblog.Blog.User
alias Microblog.Blog.Post
alias Microblog.Blog.Follow
alias Microblog.Blog.Like

Repo.delete_all(Follow)
Repo.delete_all(Post)
Repo.delete_all(User)
Repo.delete_all(Like)

ryan = Repo.insert!(%User{name: "Ryan Hughes", password_hash: "fdjfhasiuf", email: "ryanhughes624@gmail.com", username: "ryanhughes624"})
post = Repo.insert!(%Post{postid: 2, title: "Hello World", content: "Body here", user_id: "ryanhughes624" })

Repo.insert!(%Follow{follower_user_id: "ryanhughes624", following_user_id: "ryanhughes624"})

IO.puts post.id
IO.puts ryan.id

# Repo.insert!(%Like{liked_post_id: post.id, user_id: ryan.id})
