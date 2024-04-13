require "test_helper"

class ExemploControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get exemplo_index_url
    assert_response :success
  end
end
