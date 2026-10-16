import { describe, expect, it } from "vitest";
import { createPrototypeConfig } from "../src/features/recruitment/prototype-data";
import { isAllowedEmail, parsePortfolioUrls, validateRecruitmentAnswers } from "../src/features/recruitment/validation";

function validAnswers() {
  return {
    school_email: "student@vku.udn.vn",
    student_id: "00123456",
    full_name: "Nguyễn Văn A",
    class_name: "24IT1",
    interests: "Web",
    motivation: "Muốn học hỏi",
    department: "hoc_tap",
    weekly_time: "2_to_4h",
    proud_of: "",
    portfolio_links: "https://example.com\n\nhttps://github.com/example",
    facebook_url: "https://facebook.com/example",
    message: "",
    consent: true,
  };
}

describe("quy tắc email trường", () => {
  it.each(["ten@udn.vn", " TEN@VKU.UDN.VN "])("chấp nhận %s", (email) => expect(isAllowedEmail(email, "udn.vn")).toBe(true));
  it.each(["ten@gmail.com", "ten@fakeudn.vn", "ten@udn.vn.example.com", "khong-phai-email"])("từ chối %s", (email) => expect(isAllowedEmail(email, "udn.vn")).toBe(false));
});

describe("validation form động", () => {
  const config = createPrototypeConfig(true);
  it("giữ MSSV có số 0 đầu và chấp nhận dữ liệu hợp lệ", () => {
    const answers = validAnswers();
    expect(validateRecruitmentAnswers(config, answers)).toEqual({});
    expect(answers.student_id).toBe("00123456");
  });
  it("bắt required và consent", () => {
    const errors = validateRecruitmentAnswers(config, { ...validAnswers(), full_name: "", consent: false });
    expect(errors.full_name).toBeTruthy();
    expect(errors.consent).toBeTruthy();
  });
  it("từ chối lựa chọn đã bị giả mạo", () => {
    const errors = validateRecruitmentAnswers(config, { ...validAnswers(), department: "ban_khong_ton_tai" });
    expect(errors.department).toContain("không còn hợp lệ");
  });
  it("kiểm tra từng URL portfolio và bỏ dòng trống", () => {
    expect(parsePortfolioUrls("https://a.example\n\n https://b.example ")).toEqual(["https://a.example", "https://b.example"]);
    expect(validateRecruitmentAnswers(config, { ...validAnswers(), portfolio_links: "https://ok.example\nnot-a-url" }).portfolio_links).toBeTruthy();
  });
});
