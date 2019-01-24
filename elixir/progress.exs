#!/usr/bin/env elixir

defmodule Progress do

  @complete_character "█"
  @incomplete_character "░"
  @rounding_precision 2
  @progress_bar_size 50

  def bar(count, total) do
    percent = percentage_completed(count, total)
    divisor = 100 / @progress_bar_size

    complete_count = round(percent / divisor)
    incomplete_count = @progress_bar_size - complete_count

    complete = String.duplicate(@complete_character, complete_count)
    incomplete = String.duplicate(@incomplete_character, incomplete_count)

    "#{complete}#{incomplete}  (#{percent}%)"
  end

  defp percentage_completed(count, total) do
    Float.round(100.0 * count / total, @rounding_precision)
  end
end

total = 132

Enum.each(1..total, fn task ->
  IO.write("\r#{Progress.bar(task, total)}")
  Process.sleep(50)
end)

IO.write("\n")
