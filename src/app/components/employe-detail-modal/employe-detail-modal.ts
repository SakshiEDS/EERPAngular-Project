export interface EmployeeData {
    empDetail: {
        sno: number;
        empCode: number;
        empName: string;
        empImage: string;
        empFatherName: string;
        empMotherName: string;
        empMartialStatus: string;
        empSpouseName: string;
        empAnniversaryDate: string;
        empReligion: string;
        empDateOfBirth: string;
        empSex: string;
        empBloodGroup: string;
        empNationlity: string;
        empCardNo: number;
        empEmergencyName: string;
        empEmergencyRelation: string;
        empEmergencyPhoneNo: number;
        empEmergencyEmail: string;
        empLogin: boolean;
        empInTime: string;
        empOutTime: string;
        empReportingTo: string;
        empShift: string;
        empDesignation: number;
        empDepartment: number;
    };
    empBankDetail: {
        sno: number;
        empCode: number;
        empBankCode: number;
        empBankName: string;
        empBranch: string;
        empBankAccount: number;
        empIfsccode: string;
        empAccountHolderName: string;
    };
    empAttachment: {
        sno: number;
        empCode: number;
        empAttachedNo: string;
        empAttachedDocumentName: string;
        empAttachedDocument: string;
    };
    empLeaveDetail: {
        sno: number;
        empCode: number;
        empLeavesType: string;
        empLeavesAllot: string;
    };
    empOfficialInformation: {
        sno: number;
        empCode: number;
        empCityType: string;
        empJoiningDate: string;
        empConfirmationDate: string;
        empProbationMonth: number;
        empNoitceDays: number;
        empSalaryWages: string;
        empPan: string;
        empUanno: number;
        empVoterCardNo: string;
        empAadharCardNo: number;
        empPassportNo: string;
        empPassportValidDate: string;
        empDlno: string;
        empDlvalidDate: string;
    };
    empPostingAttachment: {
        sno: number;
        empCode: number;
        empDepartmentCode: number;
        empDesignationCode: number;
        empDepartment: string;
        empDesignation: string;
    };
    empQualificationExperience: {
        sno: number;
        empCode: number;
        empQualification: string;
        empPassingYear: number;
        empInstitute: string;
        empScore: string;
        empExpCompany: string;
        empExpDesignation: string;
        empExpPlace: string;
        empExpFromDate: string;
        empExpToDate: string;
        empExpYear: number;
        empExpMonth: number;
        empExpReasonLeaving: string;
    };
}
