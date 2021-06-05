package ir.ac.sbu.evaluation.dto.user.master;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import ir.ac.sbu.evaluation.dto.user.PersonalInfoDto;
import ir.ac.sbu.evaluation.dto.user.UserDto;
import ir.ac.sbu.evaluation.model.user.Master;
import java.util.Objects;
import javax.validation.constraints.NotBlank;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@JsonInclude(Include.NON_NULL)
public class MasterDto extends UserDto {

    @NotBlank
    private String degree;

    @JsonProperty(access = Access.READ_ONLY)
    private String universityName;

    @JsonProperty(access = Access.READ_ONLY)
    private String facultyName;

    public MasterDto() {
    }

    @Builder
    public MasterDto(long id,
            String firstName, String lastName, String fullName,
            String username, String password, String role,
            PersonalInfoDto personalInfo, String degree, String universityName, String facultyName) {
        super(id, firstName, lastName, fullName, username, password, role, personalInfo);
        this.degree = degree;
        this.universityName = universityName;
        this.facultyName = facultyName;
    }

    public static MasterDto from(Master master) {
        return builder()
                .id(master.getId())
                .username(master.getUsername()).password(master.getPassword())
                .firstName(master.getFirstName()).lastName(master.getLastName())
                .fullName(master.getFirstName() + " " + master.getLastName())
                .role(master.getRole())
                .personalInfo(master.getPersonalInfo() != null ? PersonalInfoDto.from(master.getPersonalInfo()) : null)
                .degree(master.getDegree())
                .universityName(master.getFaculty() != null ? master.getFaculty().getUniversity().getName() : null)
                .facultyName(master.getFaculty() != null ? master.getFaculty().getName() : null)
                .build();
    }

    public Master toMaster() {
        return Master.builder()
                .firstName(getFirstName()).lastName(getLastName())
                .username(getUsername()).password(getPassword())
                .personalInfo(getPersonalInfo() != null ? getPersonalInfo().toPersonalInfo() : null)
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
        MasterDto masterDto = (MasterDto) o;
        return Objects.equals(degree, masterDto.degree) && Objects
                .equals(universityName, masterDto.universityName) && Objects
                .equals(facultyName, masterDto.facultyName);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), degree, universityName, facultyName);
    }
}
