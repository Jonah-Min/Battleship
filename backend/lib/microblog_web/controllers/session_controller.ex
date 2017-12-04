defmodule MicroblogWeb.SessionController do
  use MicroblogWeb, :controller
  import Comeonin
  import Comeonin.Argon2

  alias Microblog.Accounts

  # TODO: Move to user.ex
  def update_tries(throttle, prev) do
    if throttle do
      prev + 1
    else
      1
    end
  end

  def throttle_attempts(user) do

    # if (0) do
    #   nil
    # else
    #   # changes = %{
    #       # pw_tries: 0,
    #       # pw_last_try: DateTime.utc_now(),
    #   # }
    #   IO.inspect(user)
    #   # {:ok, user} = Ecto.Changeset.cast(user, changes, [:pw_tries, :pw_last_try])
    #   |> NuMart.Repo.update
    #   user
    # end
  end


  # TODO: Move to user.ex
  def get_and_auth_user(email, password) do
    user = Accounts.get_user_by_email(email)
    # IO.puts email
    # IO.puts password
    # IO.puts user.password
    # IO.puts user.password_hash
    # IO.puts %{"password_hash" => user.password_hash, password => password}



    # user = throttle_attempts(user)
    case Comeonin.Argon2.check_pass(user, password) do
      {:ok, user} -> user
      _else       -> nil
    end
  end

  def login(conn, %{"email" => email, "password" => password}) do
    user = get_and_auth_user(email, password)

    if user do
      # cart = conn.assigns[:current_cart]
      # NuMart.Shop.update_cart(cart, %{user_id: user.id})

      conn
      |> put_session(:user_id, user.id)
      |> put_flash(:info, "Logged in as #{user.email}")
      |> redirect(to: post_path(conn, :index))
    else
      conn
      |> put_session(:user_id, nil)
      |> put_flash(:error, "Bad email/password")
      |> redirect(to: post_path(conn, :index))
    end
  end

  def logout(conn, _args) do
    conn
    |> put_session(:user_id, nil)
    |> put_session(:cart_id, nil)
    |> put_flash(:info, "Logged out.")
    |> redirect(to: user_path(conn, :new))
  end
end
