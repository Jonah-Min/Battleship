defmodule MicroblogWeb.PageController do
  use MicroblogWeb, :controller

  def index(conn, _params) do
    redirect conn, to: user_path(conn, :new)
  end
end
