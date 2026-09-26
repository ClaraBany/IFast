package backend.validation;

public final class ValidationPatterns {

    public static final String PHONE_E164 = "^\\+[1-9]\\d{1,14}$";

    public static final String INSTITUTIONAL_EMAIL = "^[^@\\s]+@([a-zA-Z0-9-]+\\.)?ifnmg\\.edu\\.br$";

    public static final String PLATE = "[A-Z]{3}[0-9]{4}";
    
    public static final String PLATE_MERCOSUL = "[A-Z]{3}[0-9][A-Z][0-9]{2}";

    private ValidationPatterns() {
    }
}