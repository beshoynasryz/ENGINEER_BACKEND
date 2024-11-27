module.exports = {
  user: {
      registerSuccess: "تم تسجيل المستخدم بنجاح",
      passwordMismatch: "كلمات المرور غير متطابقة",
      invalidSpecialization: "تخصص غير صحيح",
      loginError: "كلمة المرور  مطلوبه",
      userNotFound: "لم يتم العثور على المستخدم بالرقم {id}.",
      invalidPassword: "كلمة مرور غير صحيحة",
      accountInactive: "الحساب غير نشط. يرجى الاتصال بالمسؤول للحصول على المساعدة",
      statusInvalid: "حالة غير صالحة",
      statusUpdated: "تم تحديث حالة المستخدم بنجاح",
      fetchSuccess: "تم جلب المستخدم بنجاح",
      notFound: "لم يتم العثور على المستخدم",
      invalidRole: "دور غير صالح",
      profileFetchSuccess: "تم جلب الملف الشخصي بنجاح",
      countSuccess: "تم جلب عدد العملاء بنجاح",
      updateSuccess:"تم تحديث البيانات بنجاح.",
      "deleteFailedDueToProjects": "لا يمكنك حذف حسابك لأن لديك مشاريع مرتبطة. يرجى التواصل مع المسؤول للحصول على المساعدة.",
    deleteSuccess: "تم حذف المستخدم بنجاح.",
    profileDeleteSuccess: "تم حذف الملف الشخصي بنجاح.",
    notFound: "المستخدم غير موجود.",
    deleteFailed: "لا يمكن حذف المستخدم."
  },
  note: {
      contentProjectIdRequired: "المحتوى ومعرف المشروع مطلوبان.",
      projectNotFound: "لم يتم العثور على المشروع.",
      createdSuccessfully: "تم إنشاء الملاحظة بنجاح."
  },
  pagination: {
      invalidPage: "معامل الصفحة غير صالح",
      invalidLimit: "معامل الحد غير صالح",
      invalidPageLimit: "يجب أن تكون الصفحة والحد أرقام صحيحة."
  },
  engineer: {
      invalidSpecialization: "تخصص غير صحيح",
      fetchSuccess: "تم جلب المهندسين بنجاح",
      countSuccess: "تم جلب عدد المهندسين بنجاح"
  },
  review: {
      createdSuccessfully: "تم إنشاء التقييم بنجاح.",
      fetchSuccess: "تم جلب التقييمات بنجاح."
  },
  project: {
      createSuccess: "تم إنشاء المشروع بنجاح.",
      updateSuccess: "تم تحديث المشروع بنجاح.",
      updateStatusSuccess: "تم تحديث حالة المشروع بنجاح.",
      deleteSuccess: "تم حذف المشروع بنجاح.",
      notFound: "لم يتم العثور على المشروع.",
      statusInvalid: "حالة المشروع غير صحيحة.",
      clientRoleError: "لا يمكنك تغيير حالة المشروع. يمكنك فقط قبول أو رفض المشروع.",
      engineerRoleError: "لا يمكنك تغيير حالة المشروع. يمكنك فقط وضع علامة على المشروع كمكتمل.",
      invalidRole: "دور غير صالح."
  },
  phone: {
      invalidCode: "رمز البلد غير صحيح.",
      invalidLength: "يجب أن يحتوي رقم الهاتف على {expectedLength} أرقام.",
      invalidLengthSomalia: "يجب أن يحتوي رقم الهاتف على {lengths} أرقام."
  },
  admin: {
    registerSuccess: "تم تسجيل المدير بنجاح.",
    loginSuccess: "تم تسجيل الدخول بنجاح.",
    loginInvalidCredentials: "رقم الهاتف أو كلمة المرور غير صحيحة.",
    notFound: "لم يتم العثور على المدير.",
    updated: "تم تحديث المدير بنجاح.",
    deleted: "تم حذف المدير بنجاح.",
    fetchError: "خطأ في استرجاع ملف المدير الشخصي.",
    fetchProfileSuccess: "تم استرجاع ملف المدير الشخصي بنجاح."
  }
};
