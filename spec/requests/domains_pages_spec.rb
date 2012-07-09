require 'spec_helper'

describe "Domain pages" do

  subject { page }

  let(:user) { FactoryGirl.create(:user) }
  before { sign_in user }

  describe "domain creation" do
    before { visit root_path }

    describe "with invalid information" do

      it "should not create a domain" do
        expect { click_button "Add" }.should_not change(Domain, :count)
      end

      describe "error messages" do
        before { click_button "Add" }
        it { should have_content('error') } 
      end

      describe "invalid domain" do
         before do  
	   fill_in 'domain_base_domain', with: "appoldkiouerukkjklannmsdkj.co.j" 
	 end
	it "shouldnt create invalid domains" do
          expect { click_button "Add" }.should_not change(Domain, :count);
	end
      end

    end

    describe "with valid information" do

      before { fill_in 'domain_base_domain', with: "appoldkiouerukkjklannmsdkj.co.jp" }
      it "should create a domain" do
        expect { click_button "Add" }.should change(Domain, :count).by(1)
      end
    end
  end

  describe "domain destruction" do
    before { FactoryGirl.create(:domain, user: user) }

    describe "as correct user" do
      before { visit root_path }

      it "should delete a domain" do
        expect { click_link "x" }.should change(Domain, :count).by(-1)
      end
    end
  end
end
