module UrlHelper
  def get_url(url)
    s = ""
    open(url) {|f| f.each_line {|line| s += line} }
    s
  end
end
