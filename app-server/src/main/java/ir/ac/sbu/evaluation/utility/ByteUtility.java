package ir.ac.sbu.evaluation.utility;

public class ByteUtility {

    private ByteUtility() {
    }

    public static Byte[] toWrapperBytes(byte[] primitiveBytes) {
        Byte[] bytes = new Byte[primitiveBytes.length];
        int j = 0;
        for (byte b : primitiveBytes) {
            bytes[j++] = b;
        }
        return bytes;
    }

    public static byte[] toPrimitiveBytes(Byte[] bytes) {
        byte[] primitiveBytes = new byte[bytes.length];
        int j = 0;
        for (Byte b : bytes) {
            primitiveBytes[j++] = b;
        }
        return primitiveBytes;
    }

}
