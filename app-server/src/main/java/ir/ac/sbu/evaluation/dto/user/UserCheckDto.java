package ir.ac.sbu.evaluation.dto.user;

import java.util.Objects;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserCheckDto {

    private String username;

    private boolean isAvailable;

    public UserCheckDto() {
    }

    @Builder
    public UserCheckDto(String username, boolean isAvailable) {
        this.username = username;
        this.isAvailable = isAvailable;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserCheckDto that = (UserCheckDto) o;
        return isAvailable == that.isAvailable && Objects.equals(username, that.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, isAvailable);
    }
}
