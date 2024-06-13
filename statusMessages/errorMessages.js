let key = 'error';
let errorMessages = {
    UNEXPECTED_ERROR: {
        key,
        message: "Gözlənilməz xəta baş verdi. Xahiş olunur ki, daha sonra yenidən yoxlayın!"
    },
    HAS_ALREADY_NEWS: {
        key,
        message: "Bu xəbər materialı artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    HAS_ALREADY_TAG: {
        key,
        message: "Bu taq materialı artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    HAS_ALREADY_CATEGORY: {
        key,
        message: "Bu kateqoriya materialı artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    HAS_ALREADY_SUB_CATEGORY: {
        key,
        message: "Bu alt kateqoriya materialı artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    HAS_ALREADY_PLATFORM: {
        key,
        message: "Bu sosial medya platform materialı artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    HAS_ALREADY_USER: {
        key,
        message: "İstifadəçi artıq sistemdə mövcuddur. Xahiş olunur başqasını əlavə edin!"
    },
    NOT_FOUND_NEWS: {
        key,
        message: "Belə bir xəbər materialı sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    NOT_FOUND_TAG: {
        key,
        message: "Belə bir taq materialı sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    NOT_FOUND_CATEGORY: {
        key,
        message: "Belə bir kateqoriya materialı sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    NOT_FOUND_SUB_CATEGORY: {
        key,
        message: "Belə bir alt kateqoriya materialı sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    NOT_FOUND_CATEGORY_SUB_CATEGORY: {
        key,
        message: "Bu kateqoriyaya uyğun bir alt kateqoriya tapılmadı. Zəhmət olmasa, əlavə edin və yenidən cəhd edin!"
    },
    NOT_FOUND_PLATFORM: {
        key,
        message: "Belə bir sosial medya platforma materialı sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    NOT_FOUND_USER: {
        key,
        message: "İstifadəçi sistemdə tapılmadı. Bu bir xətadırsa, xahiş olunur daha sonra yenidən cəhd edin!"
    },
    CANNOT_GET_YOUTUBE_STATS: {
        key,
        message: "YouTube statistikasını əldə etmək mümkün olmadı. Xahiş olunur ki, daha sonra yenidən cəhd edəsiniz!"
    },
    FORBIDDEN_DELETE_SAME_EMAIL: {
        key,
        message: "Siz bu hesabla giriş etdiyiniz üçün eyni hesabı silə bilməzsiniz!"
    }
}

module.exports = { errorMessages }