require 'spec_helper'

describe Domain do
  let(:user) { FactoryGirl.create(:user) }
  before do
    @domain = user.domains.build(base_domain:'asdpiosadpoidsa.com')
  end

  subject { @domain }

  it { should respond_to(:base_domain) }
  it { should respond_to(:user_id) }
  it { should respond_to(:user) }
  its(:user) { should == user }

  describe "when user_id is not present" do
    before { @domain.user_id = nil }
    it { should_not be_valid }
  end

  describe "accessible attributes" do
    it "should not allow access to user_id" do
      expect do
        Domain.new(user_id: user.id)
      end.should raise_error(ActiveModel::MassAssignmentSecurity::Error)
    end    
  end

  describe "with legal domain" do
    before { @domain.base_domain = "tanaka.co.jp" }
    it { should be_valid }
  end

  describe "with illegal domain" do
    before { @domain.base_domain = "www.tasinet" }
   it { should_not be_valid }
  end
end

