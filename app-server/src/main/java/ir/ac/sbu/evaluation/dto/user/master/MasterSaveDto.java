package ir.ac.sbu.evaluation.dto.user.master;

import ir.ac.sbu.evaluation.dto.user.PersonalInfoSaveDto;
import ir.ac.sbu.evaluation.dto.user.UserSaveDto;
import ir.ac.sbu.evaluation.model.user.Master;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MasterSaveDto extends UserSaveDto {

    @NotBlank
    private String degree;

    private long facultyId;

    public MasterSaveDto() {
    }

    @Builder
    public MasterSaveDto(String firstName, String lastName, String username, String password,
            PersonalInfoSaveDto personalInfo,
            String degree, long facultyId) {
        super(firstName, lastName, username, password, personalInfo);
        this.degree = degree;
        this.facultyId = facultyId;
    }

    public Master toMaster() {
        return Master.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername())
                .password(getPassword())
                .personalInfo(getPersonalInfo().toPersonalInfo())
                .degree(degree)
                .build();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }
        MasterSaveDto that = (MasterSaveDto) o;
        return facultyId == that.facultyId && Objects.equals(degree, that.degree);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), degree, facultyId);
    }
}
