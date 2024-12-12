export interface EmployeeData {
    empDetail: {
        sno: number;
        empCode: number;
        empName: string;

        empFatherName: string;
        empMotherName: string;
        empMartialStatus: string;
        empSpouseName: string;
        empAnniversaryDate: string;
        empReligion: string;
        empMobileNo: number;
        empMail: string;
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
    // empAttachment: {
    //     sno: number;
    //     empCode: number;

    //     empAttachedDocumentName: string;
    //     empAttachedDocumentPath: string;
    // };
    empAllotedLeaves: {
        sno: number;
        empCode: number;
        empLeavesCode: number;
        empLeavesEffectiveDate: string;
        isPermitted: boolean;
    }[];
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
        empReportingTo: number;
        empShift: number;
        empEffectiveDate: string;
        empOvertimeId: number;




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
    }[];
    empAddress: {
        sno: number;
        empCode: number;
        empTempAddr: string;
        empTempCountry: number;
        empTempState: number;
        empTempCity: number | number;
        empTempPinCode: string | number;
        empTempPhoneNo: string | number;
        empTempLongitude: string;
        empTempLatitude: string;
        empPermAddr: string;
        empPermCountry: number;
        empPermState: number;
        empPermCity: number;
        empPermPinCode: string | number;
        empPermPhoneNo: string | number;
        empPermLongitude: string;
        empPermLatitude: string;
    };


    empImageFile: string;



}
